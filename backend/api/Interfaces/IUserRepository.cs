using api.DataLayer.Models;
using api.Dtos.User;

namespace api.Interfaces
{
    public interface IUserRepository
    {
        Task<User> UpdateUserProfile(string id, UpdateUserDto user);
    }
}