using System.ComponentModel.DataAnnotations;

namespace api.Dtos.User{
    public class RegisterDto
    {
        [Required]
        public string FirstName {get; set;}
        [Required]
        public string LastName{get; set;}
        [Required]
        public string Email{get; set;}
        [Required]
        [MinLength(10, ErrorMessage = "Phone number must be 10 digits long")]
        [MaxLength(10, ErrorMessage = "Phone number must be 10 digits long")]
        public string PhoneNumber{get; set;}
        [Required]
        public DateOnly BirthDate{get; set;}
        [Required]
        public string Password {get; set;}
        [Required]
        public string ConfirmPassword{get; set;}
    }
}