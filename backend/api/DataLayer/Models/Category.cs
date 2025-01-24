using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.DataLayer.Models
{
    [Table("Category", Schema = "identity")]
    public class Category
    {
        public int category_id { get; set; }
        public string category_name { get; set; }
        public ICollection<Service> services { get; set; }
    }
}