import { Paper, PaperProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const Card = styled(Paper)<PaperProps>(({ theme }) => ({
  position: "relative",
  width: "200px",
  height: "100px",
  padding: theme.spacing(1),
  wordWrap: "break-word",
  color: "white",
  cursor: "pointer",
  boxShadow: "none",
  backgroundSize: "cover",
  "&:hover": {
    filter: "brightness(.95)",
  },
}));

type Props = PaperProps & {
  color?: string;
  coverURL?: string;
};

export function PreviewCard({ color, coverURL, ...props }: Props) {
  return (
    <Card
      variant="outlined"
      sx={{
        border: "none",
        bgcolor: color,
        backgroundImage: coverURL ? `url("${coverURL}")` : undefined,
      }}
      {...props}
    />
  );
}

export function PreviewCardIconButton(props: PaperProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      {...props}
    />
  );
}
