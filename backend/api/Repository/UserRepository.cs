using api.Interfaces;
using api.DataLayer.Models;
using Microsoft.AspNetCore.Identity;
using api.Dtos.User;
using api.DataLayer;

namespace api.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly UserManager<User> _userManager;
        private readonly AppDbContext _context;

        public UserRepository(UserManager<User> userManager, AppDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        public async Task<User> UpdateUserProfile(string id, UpdateUserDto user)
        {
            var existingUser = await _userManager.FindByIdAsync(id);
            if (existingUser == null)
            {
                return null;
            }

            existingUser.FirstName = user.FirstName;
            existingUser.LastName = user.LastName;
            existingUser.PhoneNumber = user.PhoneNumber;
            existingUser.Email = user.Mail;

            var result = await _userManager.UpdateAsync(existingUser);
            if (result.Succeeded)
            {
                return existingUser;
            }

            return null;
        }
    }
}