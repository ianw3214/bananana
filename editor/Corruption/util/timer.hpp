#pragma once
#include "oasis.h"

#include <vector>
#include <chrono>

class Profiler
{
public:
    static void Init();

    static void AddProfile(const char* name, float time);
    static void Update();
private:
    struct Profile
    {
        Profile(const char* name, float time) : m_name(name), m_time(time) {}
        const char * m_name;
        float m_time;
    };
    static std::vector<Profile> s_profiles;

    static void ImGuiFunc();

    // Handle own initialization when called
    static bool s_initialized;
};

////////////////////////////////////////////////////////////////////////////////////////////////////
class Timer
{
public:
    Timer(const char * name) : m_name(name), m_stopped(false)
    {
        m_startTime = std::chrono::high_resolution_clock::now();
    }

    ~Timer()
    {
        if (!m_stopped)
        {
            Stop();
        }
    }

    void Stop()
    {
        auto endTime = std::chrono::high_resolution_clock::now();

        long long start = std::chrono::time_point_cast<std::chrono::microseconds>(m_startTime).time_since_epoch().count();
        long long end = std::chrono::time_point_cast<std::chrono::microseconds>(endTime).time_since_epoch().count();

        float duration = (end - start) * 0.001f;
        Profiler::AddProfile(m_name, duration);

        m_stopped = true;
    }

private:
    const char * m_name;
    bool m_stopped;

    std::chrono::time_point<std::chrono::steady_clock> m_startTime;
};