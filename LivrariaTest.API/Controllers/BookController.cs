using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using LivrariaTest.DAL;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace LivrariaTest.DAL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly IBookService _bookService;

        public BookController(IBookService bookService)
        {
            _bookService = bookService;
        }
        // GET: api/Book
        [HttpGet]
        public async Task<IActionResult> List()
        {
            var values = await _bookService.List();

            return Ok(values);
        }

        [HttpGet("isbn/{isbn}")]
        public async Task<IActionResult> ISBNExists(long isbn)
        {
            var exists = await _bookService.ISBNExists(isbn);

            return Ok(exists);
        }

        // GET api/<controller>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var value = await _bookService.Get(id);

            return Ok(value);
        }

        // POST api/<controller>
        [HttpPost]
        public async Task<IActionResult> Post(BookDTO value)
        {
            if (await _bookService.ISBNExists(value.ISBN))
            {
                return BadRequest("Já existe um livro com o ISBN informado");
            }

            var newBook = await _bookService.Create(value);

            return Ok(value);
        }

        // PUT api/<controller>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
