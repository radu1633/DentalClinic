using Microsoft.AspNetCore.Mvc;
using api.DataLayer.Models;
using Microsoft.AspNetCore.Identity;
using api.Dtos.User;
using api.DataLayer;
using System.Security.Claims;
using api.Interfaces;
using api.Mappers;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;

namespace api.Controllers{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly AppDbContext _context;
        private readonly IUserRepository _userRepository;
        private readonly JwtTokenService _jwtTokenService;
        private readonly SignInManager<User> _signInManager;    

        public AccountController(UserManager<User> userManager, AppDbContext context, IUserRepository userRepository, JwtTokenService jwtTokenService, SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _context = context;
            _userRepository = userRepository;
            _jwtTokenService = jwtTokenService;
            _signInManager = signInManager;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Email == model.Email);
            if (user == null){
                return Unauthorized("Invalid email or password.");
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            // Replace with your actual user authentication logic
            if (!result.Succeeded)
            {
                return Unauthorized("Invalid email or password.");
            }
            var roles = await _userManager.GetRolesAsync(user);
            var token = _jwtTokenService.GenerateToken(user.Id, model.Email, roles);
            return Ok(new { Token = token });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            if (!Is18OrOlder(model.BirthDate))
            {
                return BadRequest("User must be 18 years or older.");
            }
            
            if (model.Password != model.ConfirmPassword)
            {
                return BadRequest("Passwords do not match.");
            }

            var existingEmail = await _userManager.FindByNameAsync(model.Email);
            if (existingEmail != null)
            {
                return BadRequest("Email is already in use.");
            }
            
            var user = new User
            {   
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                BirthDate = model.BirthDate,
                UserName = model.Email
            };
            var result = await _userManager.CreateAsync(user, model.Password);

            if(result.Succeeded)
            {
                var roleResult = await _userManager.AddToRoleAsync(user, "User");
                if (!roleResult.Succeeded)
                {
                    return BadRequest("Failed to add user to role.");
                }
                return Ok();

            }
            return BadRequest("Cannot register");
        }

        [HttpPut]
        public async Task<User> UpdateUserProfile(UpdateUserDto user)
        {
            string userId = User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value;
            return await _userRepository.UpdateUserProfile(userId, user);
        }
        
        [Authorize]
        [HttpGet("user/me")]
        public async Task<IActionResult> GetUserProfile()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized("User is not authenticated.");
            }
            string userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;
            var userModel = await _context.Users.FindAsync(userId);
            return Ok(UserMappers.ToUserDto(userModel));
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            try
            {
                // Sign out the user and clear the authentication cookie
                await HttpContext.SignOutAsync();
                
                return Ok(new { message = "Successfully logged out" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Logout error: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while logging out" });
            }
        }


        static bool Is18OrOlder(DateOnly birthDate)
        {
            DateOnly today = DateOnly.FromDateTime(DateTime.Today);
            DateOnly eighteenthBirthday = birthDate.AddYears(18);

            return today >= eighteenthBirthday;
        }
    }
}