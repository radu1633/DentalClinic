using api.DataLayer.Models;
using api.Dtos.Appointment;

namespace api.Interfaces
{
    public interface IAppointmentRepository
    {
        Task<IEnumerable<AppointmentDto>> GetAppointments(string userId);
        Task<Appointment> GetAppointment(int id);
        Task<Appointment> AddAppointment(Appointment appointment);
        Task<Appointment> DeleteAppointment(int id);
        Task<IEnumerable<string>> GetAvailableHours(DateOnly date);
        Task<IEnumerable<AppointmentDto>> GetAllAppointments(string name);
        Task<IEnumerable<AppointmentDto>> GetAllAppointments();       
    }
}   