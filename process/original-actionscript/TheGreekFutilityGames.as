package
{
		
	import org.flixel.*;
	import flash.system.fscommand;
	import flash.display.*;
	import flash.geom.Rectangle;
	
	[SWF(width = "800", height = "400", backgroundColor = "#FFFFFF")]
	//[Frame(factoryClass="GreekFutilityPreloader")]
	
	public class TheGreekFutilityGames extends FlxGame
	{
		private var _assets:Assets = new Assets();
		
		public function TheGreekFutilityGames() {
			
			super(200,100,Menu,Globals.ZOOM);
			
			this.useSoundHotKeys = false;
			FlxG.volume = 1.0;
			
			/////////////////////////////////
			
			FlxG.stage.showDefaultContextMenu = false;
			FlxG.stage.displayState = StageDisplayState.FULL_SCREEN;
			FlxG.stage.scaleMode = StageScaleMode.SHOW_ALL;
			FlxG.stage.fullScreenSourceRect = new Rectangle(0,0,800,400);
			
			FlxG.stage.align = StageAlign.TOP;
			
			fscommand("trapallkeys","true");
		}
	}
}