#include "UILayer.hpp"

#include <SDL2/SDL.h>
#include "imgui.h"

void UILayer::Init()
{
    Oasis::ImGuiWrapper::AddWindowFunction([=](){
        ImGui::SetCurrentContext(Oasis::ImGuiWrapper::GetContext());
        static bool show = true;
        ImGui::Begin("TEST", &show, ImGuiWindowFlags_MenuBar);
        ImGui::End();   
    });

    /*
    Animation anim;
    Animation::Part part1;
    part1.m_id = "part1";
    Animation::Part part2;
    part2.m_id = "part2";
    anim.m_parts.push_back(part1);
    anim.m_parts.push_back(part2);
    Animation::KeyFrame key;
    key.m_positions.emplace_back();
    anim.m_keyframes.push_back(key);
    m_loader.SaveAnimation("test.json", anim);
    */
    Animation anim = m_loader.LoadAnimation("test.json");
}

void UILayer::Close()
{

}

bool UILayer::HandleEvent(const Oasis::Event& event)
{
    if (event.GetType() == Oasis::EventType::MOUSE_MOVE)
    {

    }
    if (event.GetType() == Oasis::EventType::KEY_PRESSED)
    {
        const Oasis::KeyPressedEvent& key = dynamic_cast<const Oasis::KeyPressedEvent&>(event);
        if (key.GetKey() == SDLK_ESCAPE)
        {

        }
    }
    return false;
}

void UILayer::Update()
{
    
}
