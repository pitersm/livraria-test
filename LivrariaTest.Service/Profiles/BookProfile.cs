using AutoMapper;
using LivrariaTest.DAL.Models;
using LivrariaTest.Service.DTO;

namespace LivrariaTest.DAL.Profiles
{
    public class BookProfile : Profile
    {
        public BookProfile()
        {
            CreateMap<Book, BookDTO>();
        }
    }
}
