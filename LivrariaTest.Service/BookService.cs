using AutoMapper;
using LivrariaTest.DAL.Models;
using LivrariaTest.DAL.Repository;
using LivrariaTest.Service.DTO;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LivrariaTest.Service
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
                              .OrderBy(a => a.PublicationDate)
                              .ToListAsync();
        }

        public Task<List<SalesReportDTO>> GetSalesReportByYear()
        {
            IQueryable<SalesReportDTO> query = from a in _repository.List()
                                               group a by new
                                               {
                                                  a.PublicationDate.Year
                                               }
                                               into gp
                                               let count = gp.Count()
                                               orderby gp.Key.Year ascending
                                               select new SalesReportDTO()
                                               {
                                                   Category = gp.Key.Year.ToString(),
                                                   Price = gp.Sum(b => b.Price) / count,
                                                   SalesEarnings = gp.Sum(c => c.Sales * c.Price) / count
                                               };
            return query.ToListAsync();
        }

        public Task<List<SalesReportDTO>> GetSalesReportByMonth(int year)
        {
            IQueryable<SalesReportDTO> query = from a in _repository.List().Where(book => book.PublicationDate.Year == year)
                                               group a by new
                                               {
                                                   a.PublicationDate.Month
                                               }
                                               into gp
                                               let count = gp.Count()
                                               orderby gp.Key.Month ascending
                                               select new SalesReportDTO()
                                               {
                                                   Category = gp.Key.Month.ToString(),
                                                   Price = gp.Sum(b => b.Price) / count,
                                                   SalesEarnings = gp.Sum(c => c.Sales * c.Price) / count
                                               };
            return query.ToListAsync();
        }

        public async Task<BookDTO> Create(BookDTO dto)
            {
                var newBook = await _repository.Save(_mapper.Map<Book>(dto));
                return _mapper.Map<BookDTO>(newBook);
            }

            public async Task Update(BookDTO dto)
            {
                var repoObj = _mapper.Map<Book>(dto);
                await _repository.Update(repoObj);
            }

            public async Task Delete(string id)
            {
                await _repository.Delete(id);
            }
        }
    }
