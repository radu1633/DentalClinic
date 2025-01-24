using api.DataLayer;
using api.DataLayer.Models;
using api.Dtos.Appointment;
using api.Interfaces;
using api.Mappers;
using Microsoft.CodeAnalysis.CSharp.Syntax;


//using api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace api.Repository{
    
    public class AppointmentRepository : IAppointmentRepository{

        private readonly AppDbContext _context;

        public AppointmentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Appointment> AddAppointment(Appointment appointment)
        {
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
            return appointment;
        }

        public async Task<Appointment> DeleteAppointment(int id)
        {
           var appointment = await _context.Appointments.FirstOrDefaultAsync(a => a.appointment_id == id);
            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
            return appointment;
        }

        public async Task<IEnumerable<AppointmentDto>> GetAllAppointments(string name)
        {
                return await _context.Appointments
                    .Include(a => a.User)
                    .Include(a => a.Service)
                    .Where(c => c.User.LastName == name)
                    .Select(s => s.ToAppointmentDto())
                    .ToListAsync();
        }

        public async Task<Appointment> GetAppointment(int id)
        {
             return await _context.Appointments.FirstOrDefaultAsync(a => a.appointment_id == id);
        }

        public async Task<IEnumerable<AppointmentDto>> GetAllAppointments(){
            return await _context.Appointments
                .Include(a => a.User)
                .Include(a => a.Service)
                .Select(s => s.ToAppointmentDto()).ToListAsync();
        }

        public async Task<IEnumerable<AppointmentDto>> GetAppointments(string userId)
        {
            return await _context.Appointments
                .Include(a => a.User)
                .Include(a => a.Service)
                .Where(c => c.UserId == userId)
                .Select(s => s.ToAppointmentDto())
                .ToListAsync();
        }

        public async Task<IEnumerable<string>> GetAvailableHours(DateOnly date)
        {
            
            var appointments = _context.Appointments.Where(a => DateOnly.FromDateTime(a.Date) == date).ToList();
            if (appointments == null){
                return Enumerable.Range(10, 8).Select(h => $"{h:D2}:00");
            }
            var businessHours = Enumerable.Range(10, 8).ToList();

            var bookedHours = appointments 
                .Select(a => a.Date.Hour)                         
                .Distinct();   

            return businessHours.Except(bookedHours).Select(h => $"{h:D2}:00");;   
        }
    }
}