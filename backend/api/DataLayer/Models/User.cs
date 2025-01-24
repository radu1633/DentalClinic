using Microsoft.AspNetCore.Identity;

namespace api.DataLayer.Models{

    public class User : IdentityUser
    {
        public string FirstName {get; set;}
        public string LastName {get;set;}
        public string PhoneNumber {get;set;}
        public DateOnly BirthDate {get;set;}
        public DateTime CreatedAt {get;} = DateTime.Now;
        public ICollection<Appointment> Appointments {get; set;}
        public Doctor Doctor {get; set;}
    }
}