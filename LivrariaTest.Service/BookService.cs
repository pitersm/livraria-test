using AutoMapper;
using LivrariaTest.DAL;
using LivrariaTest.DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LivrariaTest.DAL
{
    public class BookService : IBookService
    {
        private readonly IRepository<Book> _repository;
        private readonly IMapper _mapper;

        public BookService(IRepository<Book> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<BookDTO> Get(string id)
        {
            return _mapper.Map<BookDTO>(await _repository.Get(id));
        }

        public Task<List<BookDTO>> List()
        {
            return _repository.List()
                              .Select(a => _mapper.Map<BookDTO>(a))
                              .ToListAsync();
        }
    }
}
