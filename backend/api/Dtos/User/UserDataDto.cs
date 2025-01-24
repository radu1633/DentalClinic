using api.DataLayer.Models;

namespace api.Dtos.User{
    public class UserDataDto{
        public string FirstName {get; set;}
        public string LastName {get; set;}
        public string Mail {get; set;}
        public string PhoneNumber {get; set;}
        public DateOnly BirthDate {get; set;}
    }
}