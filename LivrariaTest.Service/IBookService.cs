using LivrariaTest.DAL;
using System;
using System.Text;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LivrariaTest.DAL
{
    public interface IBookService
    {
        Task<List<BookDTO>> List();
        Task<BookDTO> Get(string id);
        Task<BookDTO> Save(BookDTO dto);
        Task Update(BookDTO dto);
    }
}
