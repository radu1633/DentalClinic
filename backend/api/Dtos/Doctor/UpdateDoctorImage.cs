using System.ComponentModel.DataAnnotations;

namespace api.Dtos.Doctor
{
    public class UpdateDoctorImage
    {
        [Required]
        public string ImageName { get; set; }
        [Required]
        public IFormFile ImageFile { get; set; }
    }
}