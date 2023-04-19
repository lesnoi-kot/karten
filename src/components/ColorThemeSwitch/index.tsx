import {
  ToggleButtonGroup,
  ToggleButton,
  useColorScheme,
  ToggleButtonGroupProps,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

type Props = ToggleButtonGroupProps & {
  iconColor?: string;
};

export default function ColorThemeSwitch({ iconColor, ...props }: Props) {
  const { colorScheme, setColorScheme } = useColorScheme();

  return (
    <ToggleButtonGroup
      {...props}
      value={colorScheme}
      exclusive
      aria-label="Switch color scheme"
      onChange={(e, value) => {
        setColorScheme(value);
      }}
    >
      <ToggleButton
        value="dark"
        key="dark"
        aria-label="Dark mode"
        title="Dark mode"
      >
        <DarkModeIcon color="inherit" htmlColor={iconColor} />
      </ToggleButton>

      <ToggleButton
        value="light"
        key="light"
        aria-label="Light mode"
        title="Light mode"
      >
        <LightModeIcon color="inherit" htmlColor={iconColor} />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
