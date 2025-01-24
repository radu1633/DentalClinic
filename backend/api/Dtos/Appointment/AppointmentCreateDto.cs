using System.ComponentModel.DataAnnotations;

namespace api.Dtos.Appointment
{
    public class AppointmentCreateDto
    {   
        [Required]
        public int ServiceId { get; set; }
        
        [Required]
        public DateTime Date { get; set; }
    }
}