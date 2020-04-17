#include "loader.hpp"
#include <fstream>

Animation Loader::LoadAnimation(const std::string& path)
{
    Animation data;
    std::ifstream infile(path);
    if (infile.is_open())
    {
        json rawdata;
        infile >> rawdata;
        Animation anim;
        anim.LoadFromJson(rawdata);
        return anim;
    }
    else
    {
        // TODO: Log error
    }
    return data;
}

void Loader::SaveAnimation(const std::string& path, Animation data)
{
    std::ofstream outfile(path);
    if (outfile.is_open())
    {
        outfile << data.GetAsJson();
    }
    else
    {
        // TODO: Log error
    }
}
