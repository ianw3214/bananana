#include "timer.hpp"

#include <imgui.h>

std::vector<Profiler::Profile> Profiler::s_profiles;
bool Profiler::s_initialized;

void Profiler::Init()
{
    Oasis::ImGuiWrapper::AddWindowFunction(&Profiler::ImGuiFunc);
}

void Profiler::AddProfile(const char* name, float time)
{
    if (!s_initialized) 
    {
        Init();
        s_initialized = true;
    }
    s_profiles.emplace_back(name, time);
}

void Profiler::Update()
{
    if (!s_initialized) 
    {
        Init();
        s_initialized = true;
    }
    s_profiles.clear();
}

void Profiler::ImGuiFunc()
{
    ImGui::SetCurrentContext(Oasis::ImGuiWrapper::GetContext());
    static bool show = true;
    ImGui::Begin("PROFILER INFO", &show, ImGuiWindowFlags_MenuBar);
    for (const Profile& profile : s_profiles)
    {
        ImGui::Text("%s: %f ms", profile.m_name, profile.m_time);
    }
    ImGui::End();
}