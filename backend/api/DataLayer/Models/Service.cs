using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace api.DataLayer.Models{

    [Table("Service", Schema = "identity")]
    public class Service{
        public int service_id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public decimal price { get; set; }
        public int duration { get; set; }
        public bool active { get; set; }
        public int category_id { get; set; }
        public Category category { get; set; }
        public ICollection<Appointment> appointments { get; set; }
    }
}
