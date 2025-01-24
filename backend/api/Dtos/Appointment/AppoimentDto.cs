namespace api.Dtos.Appointment
{
    public class AppointmentDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Mail { get; set; }
        public string PhoneNumber { get; set; }
        public DateOnly Date { get; set; }
        public string Time { get; set; }
        public string ServiceName { get; set; }
    }
}