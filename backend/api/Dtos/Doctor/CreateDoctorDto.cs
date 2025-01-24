using System.ComponentModel.DataAnnotations;

namespace api.Dtos.Doctor
{
    public class CreateDoctorDto
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        public string Specialization { get; set; }

        [Required]
        public int ExperienceYears { get; set; }

        public string ImageName { get; set; }

        public IFormFile ImageFile { get; set; }
    }
}