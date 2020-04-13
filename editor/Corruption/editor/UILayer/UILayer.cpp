#include "UILayer.hpp"

#include "imgui.h"

void UILayer::Init()
{
    Oasis::ImGuiWrapper::AddWindowFunction([=](){
        ImGui::SetCurrentContext(Oasis::ImGuiWrapper::GetContext());
        static bool show = true;
        ImGui::Begin("TEST", &show, ImGuiWindowFlags_MenuBar);
        ImGui::End();   
    });
}

void UILayer::Close()
{

}

bool UILayer::HandleEvent(const Oasis::Event& event)
{
    if (event.GetType() == Oasis::EventType::MOUSE_MOVE)
    {

    }
    return false;
}

void UILayer::Update()
{
    
}
