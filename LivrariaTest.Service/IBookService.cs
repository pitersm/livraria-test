using LivrariaTest.DAL;
using System;
using System.Text;
using System.Collections.Generic;
using System.Threading.Tasks;
using LivrariaTest.Service.DTO;

namespace LivrariaTest.Service
{
    public interface IBookService
    {
        Task<List<BookDTO>> List();
        Task<List<SalesReportDTO>> GetSalesReportByMonth(int year);
        Task<List<SalesReportDTO>> GetSalesReportByYear();
        Task<BookDTO> Get(string id);
        Task<BookDTO> Create(BookDTO dto);
        Task Update(BookDTO dto);
        Task<bool> ISBNExists(long isbn);
        Task Delete(string id);
    }
}
