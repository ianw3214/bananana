#include "animation.hpp"

// -------------------------------------------------------------------------------------
// Serialization code
json Animation::Part::GetAsJson() const
{
    json result;
    result["id"] = m_id;
    result["image"] = m_image;
    result["width"] = m_width;
    result["height"] = m_height;
    result["anchorX"] = m_anchorX;
    result["anchorY"] = m_anchorY;
    result["srcWidth"] = m_srcWidth;
    result["srcHeight"] = m_srcHeight;
    result["srcX"] = m_srcX;
    result["srcY"] = m_srcY;
    return result;
}

json Animation::KeyFrame::PartPosition::GetAsJson() const
{
    json result;
    result["id"] = m_id;
    result["offsetX"] = m_offsetX;
    result["offsetY"] = m_offsetY;
    result["angle"] = m_angle;
    return result;
}

json Animation::KeyFrame::GetAsJson() const
{
    std::vector<json> positions;
    for (const PartPosition& position : m_positions)
    {
        positions.push_back(position.GetAsJson());
    }

    json result;
    result["frame"] = m_frame;
    result["positions"] = positions;
    return result;
}

json Animation::GetAsJson() const
{
    std::vector<json> parts;
    for (const Part& part : m_parts)
    {
        parts.push_back(part.GetAsJson());
    }
    std::vector<json> keyframes;
    for (const KeyFrame& frame : m_keyframes)
    {
        keyframes.push_back(frame.GetAsJson());
    }

    json result;
    result["loop"] = m_loop;
    result["parts"] = parts;
    result["keyframes"] = keyframes;
    return result;
}

// -------------------------------------------------------------------------------------
// Deserialization code
// TODO: Handle errors better
void Animation::Part::LoadFromJson(const json& data)
{
    m_id = data["id"];
    m_image = data["image"];
    m_width = data["width"];
    m_height = data["height"];
    m_anchorX = data["anchorX"];
    m_anchorY = data["anchorY"];
    m_srcWidth = data["srcWidth"];
    m_srcHeight = data["srcHeight"];
    m_srcX = data["srcX"];
    m_srcY = data["srcY"];
}

void Animation::KeyFrame::PartPosition::LoadFromJson(const json& data)
{
    m_id = data["id"];
    m_offsetX = data["offsetX"];
    m_offsetY = data["offsetY"];
    m_angle = data["angle"];
}

void Animation::KeyFrame::LoadFromJson(const json& data)
{
    m_frame = data["frame"];
    for (const json& positionData : data["positions"])
    {
        Animation::KeyFrame::PartPosition position;
        position.LoadFromJson(positionData);
        m_positions.push_back(position);
    }
}

void Animation::LoadFromJson(const json& data)
{
    m_loop = data["loop"];
    for (const json& partData : data["parts"])
    {
        Animation::Part part;
        part.LoadFromJson(partData);
        m_parts.push_back(part);
    }
    for (const json& keyframeData : data["keyframes"])
    {
        Animation::KeyFrame keyframe;
        keyframe.LoadFromJson(keyframeData);
        m_keyframes.push_back(keyframe);
    }
}