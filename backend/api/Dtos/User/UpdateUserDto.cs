using System.ComponentModel.DataAnnotations;

namespace api.Dtos.User
{
    public class UpdateUserDto
    {
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string Mail { get; set; }
        [Required]
        [MinLength(10, ErrorMessage = "Phone number must be 10 digits long")]
        [MaxLength(10, ErrorMessage = "Phone number must be 10 digits long")]
        public string PhoneNumber { get; set; }
    }

    
}