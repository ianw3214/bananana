#pragma once
#include "oasis.h"

#include "UILayer/UILayer.hpp"

class Game : public Oasis::GameState
{
public:
    virtual void InitLayers() override
    {
        // Layers are added bottom -> top
        AddLayer(new UILayer());
    }
};