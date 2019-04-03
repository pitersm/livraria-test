using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace LivrariaTest.DAL
{
    public class BookDTO
    {
        public Guid? Id { get; set; }
        [Required]
        [StringLength(50, ErrorMessage = "O valor excede o limite de caracteres")]
        public string Name { get; set; }
        [Required]
        [StringLength(50, ErrorMessage = "O valor excede o limite de caracteres")]
        public string Publisher { get; set; }
        [Required]
        [StringLength(50, ErrorMessage = "O valor excede o limite de caracteres")]
        public string Author { get; set; }
        [Required]
        public long ISBN { get; set; }
        [Required]
        public decimal Price { get; set; }
        [Required]
        public DateTime PublicationDate { get; set; }
    }
}
