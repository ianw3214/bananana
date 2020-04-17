#pragma once

#include "nlohmann/json.hpp"
using json = nlohmann::json;

#include <string>
#include <vector>

// ------------------------------------------------------------------
struct Animation
{

    // -------------------------------------------------------------
    struct Part
    {
        std::string m_id;
        std::string m_image;
        int m_width;
        int m_height;
        int m_anchorX;
        int m_anchorY;
        // Source image dimensions
        int m_srcWidth;
        int m_srcHeight;
        int m_srcX;
        int m_srcY;

        Part()
            : m_id()
            , m_image()
            , m_width(0)
            , m_height(0)
            , m_anchorX(0)
            , m_anchorY(0)
            , m_srcWidth(0)
            , m_srcHeight(0)
            , m_srcX(0)
            , m_srcY(0)
        {}

        json GetAsJson() const;
        void LoadFromJson(const json& data);
    };

    // -------------------------------------------------------------
    struct KeyFrame
    {
        struct PartPosition
        {
            std::string m_id;
            int m_offsetX;
            int m_offsetY;
            float m_angle;

            PartPosition()
                : m_id()
                , m_offsetX(0)
                , m_offsetY(0)
                , m_angle(0.f)
            {}

            json GetAsJson() const;
            void LoadFromJson(const json& data);
        };

        int m_frame;
        std::vector<PartPosition> m_positions;

        KeyFrame()
            : m_frame(0)
            , m_positions()
        {}

        json GetAsJson() const;
        void LoadFromJson(const json& data);
    };

    bool m_loop;
    std::vector<Part> m_parts;
    std::vector<KeyFrame> m_keyframes;

    Animation()
        : m_loop(false)
        , m_parts()
        , m_keyframes()
    {}

    json GetAsJson() const;
    void LoadFromJson(const json& data);
};