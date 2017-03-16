package
{
	
	import org.flixel.FlxSound;
	
	public class Assets
	{
		
		[Embed(source="assets/sounds/swoopup.mp3")]
		public static const SWOOP_UP:Class;
		public static var swoopUp:FlxSound;
		
		[Embed(source="assets/sounds/swoopdown.mp3")]
		public static const SWOOP_DOWN:Class;
		public static var swoopDown:FlxSound;

		[Embed(source="assets/sounds/victory.mp3")]
		public static const VICTORY:Class;
		public static var victory:FlxSound;

		[Embed(source="assets/sounds/peck.mp3")]
		public static const PECK:Class;
		public static var peck:FlxSound;

		public function Assets() {
		}
	}
	
}