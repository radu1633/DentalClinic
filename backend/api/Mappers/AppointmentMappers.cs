using api.Dtos.Appointment;
using api.DataLayer.Models;

namespace api.Mappers
{
    public static class AppointmentMappers
    {
        public static AppointmentDto ToAppointmentDto(this Appointment appointment){

            return new AppointmentDto{
                Id = appointment.appointment_id,
                FirstName = appointment.User.FirstName,
                LastName = appointment.User.LastName,
                Mail = appointment.User.Email,
                PhoneNumber = appointment.User.PhoneNumber,
                Date = DateOnly.FromDateTime(appointment.Date),
                Time = $"{TimeOnly.FromDateTime(appointment.Date).Hour:D2}:{TimeOnly.FromDateTime(appointment.Date).Minute:D2}",
                ServiceName = appointment.Service.name
            };
        }
    }
}