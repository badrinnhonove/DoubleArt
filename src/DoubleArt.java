/**
 * Matthew Jones
 * 10/21/2015
 */

import java.awt.image.BufferedImage;
import java.awt.image.Raster;
import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.Comparator;

import javax.imageio.ImageIO;

public class DoubleArt {

	/**
	 * Color and original pixel position tracking.
	 */
	public static class Color {
		public int R;
		public int G;
		public int B;
		public int X;
		public int Y;
		public Color(int r, int g, int b, int x, int y) {
			R=r;
			G=g;
			B=b;
			X=x;
			Y=y;
		}
		public void print() {
			System.out.println(R + " " + G + " " + B);
		}
	}
	
	/**
	 * Run le program
	 */
	public static void main(String[] args) {
		if (args.length < 2) {
			System.out.println("Need two files!");
			System.out.println("usage: java DoubleArt <TARGET> <PALETTE>");
			return;
		}
		
		doConversion(args[0], args[1]);
	}
	
	/**
	 * Compare some colors by averaging their RGB components.
	 */
	public static class ColorCompAvg implements Comparator<Color> {
		@Override
		public int compare(Color c1, Color c2) {
			float avg1 = (c1.R + c1.G + c1.B)/3.0f;
			float avg2 = (c2.R + c2.G + c2.B)/3.0f;
			if (avg1 == avg2) return 0;
			return avg1 > avg2 ? 1 : -1;
		}
		
	}
	
	/**
	 * Make image magic happen!
	 * @param target Target file name
	 * @param pal Palette file name
	 */
	public static void doConversion(String target, String pal) {
		
		int width = 0;
		int height = 0;
		Color[] targetData;
		Color[] colorData;
		
		try {
			BufferedImage input = ImageIO.read(new File(target));
			Raster inData = input.getData();
			width = inData.getWidth();
			height = inData.getHeight();
			System.out.println("Target: " + width + " " + height);
			targetData = convertToArray(inData);
			System.out.println("Done!");
		} catch (IOException e) {
			System.out.println("Failed to read target image!");
			System.out.println(e.getMessage());
			return;
		}
		
		try {
			BufferedImage input = ImageIO.read(new File(pal));
			Raster inData = input.getData();
			System.out.println("Colors: " + width + " " + height);
			colorData = convertToArray(inData);
			System.out.println("Done!");
		} catch (IOException e) {
			System.out.println("Failed to read color palette!");
			System.out.println(e.getMessage());
			return;
		}
		
		Arrays.sort(targetData, new ColorCompAvg());
		Arrays.sort(colorData, new ColorCompAvg());
		
		Color curColor;
		Color targetPt;
		BufferedImage out = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
		for (int i = 0; i < targetData.length; i++) {
			float colorPercent = (float)i/(float)targetData.length;
			curColor = colorData[(int)(colorPercent*(colorData.length-1))];
			targetPt = targetData[i];
			out.setRGB(targetPt.X, targetPt.Y, colorToInt(curColor));
		}
		
		try {
			File outFile = new File("out.png");
			ImageIO.write(out, "PNG", outFile);
		} catch (Exception e) {
			System.out.println("Failed to write image!");
			System.out.println(e.getMessage());
		}
	}
	
	/**
	 * Take a color and cram the RGB components into an int.
	 */
	public static int colorToInt(Color c) {
		int color = c.R;
		color = (color << 8) + c.G;
		color = (color << 8) + c.B;
		return color;
	}
	
	/**
	 * Read colors and put them in an array.
	 */
	public static Color[] convertToArray(Raster img) {
		int[] buff = new int[3];
		Color[] arr = new Color[img.getHeight() * img.getWidth()];
		for (int i = 0; i < img.getHeight(); i++) {
			for (int j = 0; j < img.getWidth(); j++) {
				buff = img.getPixel(j, i, buff);
				arr[(i*img.getWidth()) + j] =
						new Color(buff[0], buff[1], buff[2], j, i);
			}
		}
		return arr;
	}
	
}
