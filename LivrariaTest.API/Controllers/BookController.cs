using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using LivrariaTest.DAL;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace LivrariaTest.DAL.Controllers
{
    [Route("api/[controller]")]
    public class BookController : Controller
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

        // GET api/<controller>/5
        [HttpGet("{id}")]
        public IActionResult Get(string id)
        {
            var value = _bookService.Get(id);

            return Ok(value);
        }

        // POST api/<controller>
        [HttpPost]
        public void Post([FromBody]string value)
        {
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
