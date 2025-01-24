using api.Dtos.User;
using api.DataLayer.Models;

namespace api.Mappers{
    public static class UserMappers{
        public static UserDataDto ToUserDto(this User user){
            return new UserDataDto{
                FirstName = user.FirstName,
                LastName = user.LastName,
                Mail = user.Email,
                PhoneNumber = user.PhoneNumber,
                BirthDate = user.BirthDate
            };
        }
    }
}