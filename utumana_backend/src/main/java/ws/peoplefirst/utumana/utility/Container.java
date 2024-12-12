package ws.peoplefirst.utumana.utility;

import org.springframework.ui.Model;

public class Container {

	private Model model;
	//private boolean lecit;	//Membro annotato per la rimozione
	
	
	public Model getModel() {
		return model;
	}
	public void setModel(Model model) {
		this.model = model;
	}
	
//	public boolean isLecit() {
//		return lecit;
//	}
//	public void setLecit(boolean lecit) {
//		this.lecit = lecit;
//	}
}
