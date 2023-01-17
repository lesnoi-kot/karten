import { Typography, TypographyProps } from "@mui/material";

function Heading(props: TypographyProps<"h1">) {
  return <Typography variant="h3" {...props} component="h1" />;
}

export default Heading;
