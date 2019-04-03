using AutoMapper;
using LivrariaTest.DAL;
using LivrariaTest.DAL.Models;
using System;
using System.Collections.Generic;
using System.Text;

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
