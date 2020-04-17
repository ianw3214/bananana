#pragma once

#include "nlohmann/json.hpp"
using json = nlohmann::json;

#include "animation.hpp"

// ------------------------------------------------------------------
// Using json for animation data to easily share data to javascript
class Loader {
public:
    Animation LoadAnimation(const std::string& path);
    void SaveAnimation(const std::string& path, Animation data);
private:
};