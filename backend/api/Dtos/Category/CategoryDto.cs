using System.ComponentModel.DataAnnotations;
using api.Dtos.Service;

namespace api.Dtos.Category
{
    public class CategoryDto
    {
        public string category_name { get; set; }
        public List<ServiceDto> services { get; set; }
        //public ICollection<ToServiceDto> services { get; set; }
    }
}