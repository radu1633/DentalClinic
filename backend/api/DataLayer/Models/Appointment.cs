using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.DataLayer.Models{

    [Table("Appointment", Schema = "identity")]
    public class Appointment{
        public int appointment_id {get; set;}
        public string UserId {get; set;}
        public int ServiceId {get; set;}    
        public DateTime Date {get; set;}
        public User User {get; set;}
        public Service Service {get; set;}     
    }
}