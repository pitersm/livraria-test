using AutoMapper;
using LivrariaTest.DAL;
using LivrariaTest.DAL.Models;
using LivrariaTest.DAL.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LivrariaTest.DAL
{
    public class BookService : IBookService
    {
        private readonly IBookRepository _repository;
        private readonly IMapper _mapper;

        public BookService(IBookRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<BookDTO> Get(string id)
        {
            return _mapper.Map<BookDTO>(await _repository.Get(id));
        }

        public Task<bool> ISBNExists(long isbn)
        {
            return _repository.ISBNExists(isbn);
        }

        public Task<List<BookDTO>> List()
        {
            return _repository.List()
                              .Select(a => _mapper.Map<BookDTO>(a))
                              .ToListAsync();
        }

        public async Task<BookDTO> Create(BookDTO dto)
        {
            var newBook = await _repository.Save(_mapper.Map<Book>(dto));
            return _mapper.Map<BookDTO>(newBook);
        }

        public async Task Update(BookDTO dto) {
            var repoObj = await _repository.Get(dto.Id.ToString());
            repoObj = _mapper.Map<Book>(dto);
            await _repository.Update(repoObj);
        }
    }
}
