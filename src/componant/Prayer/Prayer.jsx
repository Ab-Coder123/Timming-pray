import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function MediaCard({ name, time, image }) {
	return (
		<Card sx={{ width: "18vw" , borderRadius:"10px" , cursor:"pointer" , marginRight:"15px", padding:"px"}}>
			<CardMedia
				sx={{ height: 140 }}
				image={image}
				title="green iguana"
			/>
			<CardContent>
				<h1>{name}</h1>

				<Typography variant="h2" style={{color:"green"}} color="text.secondary">
					{time}
				</Typography>
			</CardContent>
		</Card>
	);
}