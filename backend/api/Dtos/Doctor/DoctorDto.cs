using System.ComponentModel.DataAnnotations;

namespace api.Dtos.Doctor{
    public class DoctorDto{

        public int Id { get; set; }
        public string FirstName {get; set;}
        public string LastName {get; set;}
        public string Specialization {get; set;}
        public int ExperienceYears {get; set;}
        public string ImageSrc {get; set;}
    }
}