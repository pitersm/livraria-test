using System;
using System.Collections.Generic;
using System.Text;

namespace LivrariaTest.DAL
{
    public class BookDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Publisher { get; set; }
        public string Author { get; set; }
        public string ISBN { get; set; }
        public decimal Price { get; set; }
        public DateTime PublicationDate { get; set; }
    }
}
