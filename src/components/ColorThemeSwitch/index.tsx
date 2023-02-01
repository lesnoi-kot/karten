import {
  ToggleButtonGroup,
  ToggleButton,
  useColorScheme,
  ToggleButtonGroupProps,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";

export default function ColorThemeSwitch(props: ToggleButtonGroupProps) {
  const { colorScheme, setColorScheme } = useColorScheme();

  return (
    <ToggleButtonGroup
      {...props}
      value={colorScheme}
      size="small"
      exclusive
      aria-label="Switch color scheme"
      onChange={(e, value) => {
        setColorScheme(value);
      }}
    >
      <ToggleButton
        value="dark"
        key="left"
        aria-label="Dark mode"
        title="Dark mode"
      >
        <DarkModeIcon color="inherit" />
      </ToggleButton>

      {/* <ToggleButton value="system" key="system">
        <SettingsBrightnessIcon />
      </ToggleButton> */}

      <ToggleButton
        value="light"
        key="light"
        aria-label="Light mode"
        title="Light mode"
      >
        <LightModeIcon color="inherit" />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
