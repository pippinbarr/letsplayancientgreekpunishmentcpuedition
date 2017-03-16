package
{
	
	import flash.text.TextField;
	import flash.text.TextFormat;
	
	import flash.events.KeyboardEvent;
	import flash.ui.Keyboard;
	
	import org.flixel.*;
	
	public class Menu extends FlxState {
		
		private var _titleText:String = "LET'S PLAY:\nANCIENT GREEK PUNISHMENT!";
		private var _titleTextField:TextField;
		private var _titleFormat:TextFormat = new TextFormat("COMMODORE",48,0x000000,null,null,null,null,null,"center",null,null);
		private var _optionsText:String = "(S)ISYPHUS\n(T)ANTALUS\n(P)ROMETHEUS\n(D)ANAIDS\n(Z)ENO";
		private var _optionsTextField:TextField;
		private var _optionsFormat:TextFormat = new TextFormat("COMMODORE",32,0x000000,null,null,null,null,null,"center",null,null);
		
		public function Menu() {
			super();
		}
		
		
		public override function create():void {
			
			FlxG.bgColor = 0xFFAADDDD;
			
			Assets.swoopUp = new FlxSound();
			Assets.swoopUp.loadEmbedded(Assets.SWOOP_UP,false);
			Assets.swoopDown = new FlxSound();
			Assets.swoopDown.loadEmbedded(Assets.SWOOP_DOWN,false);
			Assets.victory = new FlxSound();
			Assets.victory.loadEmbedded(Assets.VICTORY,false);
			Assets.peck = new FlxSound();
			Assets.peck.loadEmbedded(Assets.PECK,false);

			Assets.swoopUp.volume = 0
			Assets.swoopUp.play();
			Assets.swoopDown.volume = 0
			Assets.swoopDown.play();
			Assets.victory.volume = 0
			Assets.victory.play();
			Assets.peck.volume = 0
			Assets.peck.play();
			
			_titleTextField = Helpers.makeTextField(0,10,FlxG.width,50,_titleText,_titleFormat);
			_optionsTextField = Helpers.makeTextField(0,52,FlxG.width,FlxG.height,_optionsText,_optionsFormat);

			FlxG.stage.addChild(_titleTextField);
			FlxG.stage.addChild(_optionsTextField);
			
			FlxG.stage.addEventListener(KeyboardEvent.KEY_DOWN,keyDown);
			
			super.create();
			
		}
		
		
		public override function update():void {
			
			super.update();
			
		}
		
		
		private function keyDown(e:KeyboardEvent):void {
			
			if (e.keyCode == Keyboard.S) {
				FlxG.stage.removeEventListener(KeyboardEvent.KEY_DOWN,keyDown);
				FlxG.switchState(new Sisyphus);
			}
			else if (e.keyCode == Keyboard.T) {
				FlxG.stage.removeEventListener(KeyboardEvent.KEY_DOWN,keyDown);
				FlxG.switchState(new Tantalus);
			}
			else if (e.keyCode == Keyboard.P) {
				FlxG.stage.removeEventListener(KeyboardEvent.KEY_DOWN,keyDown);
				FlxG.switchState(new Prometheus);
			}
			else if (e.keyCode == Keyboard.D) {
				FlxG.stage.removeEventListener(KeyboardEvent.KEY_DOWN,keyDown);
				FlxG.switchState(new Danaids);
			}
			else if (e.keyCode == Keyboard.Z) {
				FlxG.stage.removeEventListener(KeyboardEvent.KEY_DOWN,keyDown);
				FlxG.switchState(new Zeno);
			}
		}

		
		
		public override function destroy():void {
		
			if (_titleTextField && FlxG.stage.contains(_titleTextField)) FlxG.stage.removeChild(_titleTextField);
			if (_optionsTextField && FlxG.stage.contains(_optionsTextField)) FlxG.stage.removeChild(_optionsTextField);

			FlxG.stage.focus = null;
			
			super.destroy();
			
		}
		
	}
}