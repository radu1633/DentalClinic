namespace api.Dtos.Service
{
    public class ServiceDto
    {
        public int service_id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public decimal price { get; set; }
        public int duration { get; set; }
        public string category { get; set; }

    }
}