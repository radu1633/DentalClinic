
using System.ComponentModel.DataAnnotations.Schema;

namespace api.DataLayer.Models{

    [Table("Doctors")]
    public class Doctor{
        public int DoctorId {get; set;}
        public string UserId {get; set;}
        public string Specialization {get; set;}
        public int ExperienceYears {get; set;}
        public string ImageName {get; set;}

        [NotMapped]
        public string ImageSrc {get; set;}   
        [NotMapped]
        public IFormFile ImageFile {get; set;}
        
        public User User {get; set;} 
    }
}