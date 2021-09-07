//Samurai71 mod

//define the mod name,versions, the var for it, 
if(SpellCaster === undefined) 
    var SpellCaster = {};
SpellCaster.name = 'SpellCaster Madeleine Merlin';
SpellCaster.version = '0.1';
SpellCaster.GameVersion = '2.04';

SpellCaster.launch = function()
{
    SpellCaster.init = function()
    {
        //set loaded to true, create a backup and config.
        SpellCaster.isloaded = 1;
        
        Game.customOptionsMenu.push(function()
        {
            CCSE.AppendCollapsibleOptionsMenu(SpellCaster.name, SpellCaster.getMenuString());
        });

        Game.customStatsMenu.push(function(){
			CCSE.AppendStatsVersionNumber(SpellCaster.name, SpellCaster.version);
		});

        //brings up game notification that the mod has been loaded.
        if (Game.prefs.popups) 
            Game.Popup('SpellCaster Madeleine has awakened!');
		else 
            Game.Notify('SpellCaster summoned!', 1);
    }

    SpellCaster.getSpellCost = function()
    {
        var spellBook = Game.Objects["Wizard tower"].minigame;


    }


    //provides desciption/ option/ info of what the mod is doing
    SpellCaster.getMenuString = function()
    {
        //let m = CCSE.MenuHelper;
        var str = '<div class="listing>Miss Madeleine Merlin will automatically cast spells for you. <3 </div>'
        + 'I am currently in trainning so I can\'t cast anything right. :( ';
        
        return str;
    }

    //comfirms the the mod version and registers it.
    if(CCSE.ConfirmGameVersion(SpellCaster.name, SpellCaster.version, SpellCaster.GameVersion)) 
        Game.registerMod(SpellCaster.name, SpellCaster); 
}

//check whether the mod(s) has been launched
if(!SpellCaster.isloaded)
{
    if(CCSE && CCSE.isloaded)
    {
        SpellCaster.launch();
    }
    else
    {
        if(!CCSE)
            var CCSE = {};
        if(!CCSE.postLoadHooks)
        CCSE.postLoadHooks = [];
        CCSE.postLoadHooks.push(SpellCaster.launch);
    }
}