"use client";
import React from "react";
import Image from "next/image";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import Avatar from "react-avatar";

const Header = () => {
  return (
    <header>
      <div className="flex flex-col gap-4 p-4 md:flex-row md:gap-0 items-center justify-between w-full bg-gray-500/15">
        {/* Gradient Background */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 to-[#0055D1] rounded-md opacity-30 filter blur-3xl -z-50" />
        <Image
          src="https://links.papareact.com/c2cdd5"
          priority={true}
          alt="Trell Clone"
          width={300}
          height={300}
          className="w-44 md:w-56 object-contain"
        />
        {/* Search Box */}
        <div className="flex items-center gap-4 w-full justify-end">
          <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
            <FaSearch className="text-gray-400 text-lg md:text-xl" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 md:flex-initial outline-none"
            />
            <button type="submit" hidden>
              Search
            </button>
          </form>
          {/* Avatar */}
          <Avatar name="Dazzler Abhi" round size="40" color="#F52E89" />
        </div>
      </div>
      <div className="flex items-center justify-center py-2 md:py-5 px-5">
        <p className="flex items-center bg-gray-100/30 p-5 text-sm font-light pr-5 shadow-xl rounded-xl w-fit bg-white italic max-w-4xl text-[#0055D1] gap-2">
          <FaUserCircle fontSize={30} className="text-pink-500 animate-spin" />
          GPT is summarizing your tasks for the day...
        </p>
      </div>
    </header>
  );
};

export default Header;
