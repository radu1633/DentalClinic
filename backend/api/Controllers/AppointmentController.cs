using Microsoft.AspNetCore.Mvc;
using api.Interfaces;
using api.Dtos.Appointment;
using api.DataLayer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using api.DataLayer.Models;
using System.Security.Claims;
using api.DataLayer;

namespace api.Controllers{
    

    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly UserManager<User> _userManager;
        private readonly AppDbContext _context;

        public AppointmentController(IAppointmentRepository appointmentRepository, UserManager<User> userManager, AppDbContext context)
        {
            _appointmentRepository = appointmentRepository;
            _userManager = userManager;
            _context = context;
        }

        [HttpGet]
        public async Task<IEnumerable<AppointmentDto>> GetAppointments()
        {
            string userId = User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value;
            return await _appointmentRepository.GetAppointments(userId);
        }

        [HttpGet("{name}")]
        public async Task<IEnumerable<AppointmentDto>> GetAllAppointments(string name)
        {
            return await _appointmentRepository.GetAllAppointments(name);
        }

        [HttpGet("all")]
        public async Task<IEnumerable<AppointmentDto>> GetAllAppointments()
        {
            return await _appointmentRepository.GetAllAppointments();
        }

        [HttpGet("available-hours")]
        public async Task<IEnumerable<string>> GetAvailableHours([FromQuery] DateOnly date)
        {
            return await _appointmentRepository.GetAvailableHours(date);
        }

        [HttpGet("{id:int}")]
        public async Task<Appointment> GetAppointment(int id)
        {
            return await _appointmentRepository.GetAppointment(id);
        }

        [Authorize]
        [HttpPost]
        public async Task<Appointment> AddAppointment(AppointmentCreateDto appointment)
        {
            string userId = User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value;
            var userModel = await _context.Users.FindAsync(userId);
            var newAppointment = new Appointment
            {
                UserId = userModel.Id,
                ServiceId = appointment.ServiceId,
                Date = appointment.Date
            };

            return await _appointmentRepository.AddAppointment(newAppointment);
        }

        [HttpDelete("{id:int}")]
        public async Task<Appointment> DeleteAppointment(int id)
        {
            return await _appointmentRepository.DeleteAppointment(id);
        }
    }
}